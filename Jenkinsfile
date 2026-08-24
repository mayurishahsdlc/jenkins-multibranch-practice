pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh '''
                    node --check app.js
                    node test.js
                '''
            }
        }

        stage('Deploy') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        echo "Deploying MAIN / PRODUCTION"

                        sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@localhost "
                                cd /home/ubuntu/jenkins-multibranch-practice &&
                                pm2 delete jenkins-main || true &&
                                APP_BRANCH=main PORT=3000 pm2 start app.js --name jenkins-main &&
                                pm2 save
                            "
                        '''

                    } else if (env.BRANCH_NAME == 'staging') {

                        echo "Deploying STAGING"

                        sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@localhost "
                                cd /home/ubuntu/jenkins-multibranch-practice &&
                                pm2 delete jenkins-staging || true &&
                                APP_BRANCH=staging PORT=3001 pm2 start app.js --name jenkins-staging &&
                                pm2 save
                            "
                        '''

                    } else {

                        error("Deployment is not configured for branch: ${env.BRANCH_NAME}")

                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        sh '''
                            sleep 3
                            curl -f http://127.0.0.1:3000/health
                        '''

                    } else if (env.BRANCH_NAME == 'staging') {

                        sh '''
                            sleep 3
                            curl -f http://127.0.0.1:3001/health
                        '''

                    }
                }
            }
        }
    }

    post {

        success {
            echo "Deployment successful for ${env.BRANCH_NAME}"
        }

        failure {
            echo "Deployment failed for ${env.BRANCH_NAME}"
        }
    }
}
