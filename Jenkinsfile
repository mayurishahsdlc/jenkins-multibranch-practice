pipeline {
    agent any 
	  environment {
	    IMAGE_NAME = "jenkins-multibranch-practise"
		CONTAINER_NAME = "jenkins-main"
		APP_PORT = "3000"
	}
	 stages {
	    stage ('Checkout') {
		 steps {
		   echo "Building branc:${env.BRANCH_NAME}"
		   checkout scm
		}
	}
	    stage ('Test') {
		    steps {
			  echo "Running tests inside Node Docker container"
			  sh '''
			      docker run --rm \
				  -v "$WORKSPACE:/app" \
				  -w /app \
				  node:20-alpine \
				  sh -c "npm ci && npm test"
			  '''
			}
		}
		stage('Docker Build') {
		    steps {
			    echo "Building application Docker Image"
			sh '''
			    docker build \
				    -t ${IMAGE_NAME}:${BUILD_NUMBER} \
					-t ${IMAGE_NAME}:latest \
				    .
			'''
           }			
		}
        stage('Stop Old Container') {
            steps {
                echo "Stopping old application container"			
				
				sh '''
				    docker rm -f ${CONTAINER_NAME} || true
				'''
			}
		}
		
		stage('Deploy') {
		    steps {
			   echo "Starting new Docker container"
			   
			   sh '''
			       docker run -d \
				       --name ${CONTAINER_NAME} \
					   -p ${APP_PORT}:3000 \
					   -e PORT=3000 \
					   -e APP_BRANCH=${BRANCH_NAME} \
					   ${IMAGE_NAME}:${BUILD_NUMBER}
				 '''
			}
		}
		stage('Health Check') {
		   steps {
		      echo "Checking application health"
			  
			  sh '''
			     sleep 5
				 
				 curl -f http://127.0.0.1:${APP_PORT}/health
			  '''
			}
		}
	}
	
	post {
	    success {
		    echo "============================="
			echo "DOCKER DEPLOYMENT SUCCESSFUL"
			echo "Branch:${BRANCH_NAME}"
			echo "Container:${CONTAINER_NAME}"
			echo "============================="
		}
		
		failure {
		  echo "============================="
		  echo "DOCKER DEPLOYMENT FAILED"
		  echo "============================="
		}
		always {
		    sh '''
			    echo "Running Containers:"
				docker ps || true
			'''
		}
	}
}
EOF
