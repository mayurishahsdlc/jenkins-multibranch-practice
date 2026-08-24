        stage('Deploy') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        echo "Deploying MAIN PRODUCTION SERVER - PORT 3000"

                        sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@localhost "
                                cd /home/ubuntu/jenkins-multibranch-practice &&
                                pm2 delete jenkins-main || true &&
                                APP_BRANCH=main PORT=3000 pm2 start app.js --name jenkins-main &&
                                pm2 save
                            "
                        '''

                    } else if (env.BRANCH_NAME == 'staging') {

                        echo "Deploying STAGING SERVER - PORT 3001"

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
