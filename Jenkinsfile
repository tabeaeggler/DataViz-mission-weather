pipeline {
    agent any
    stages {
        stage('Build Frontend') { 
            steps {
                sh """
                cd client
                npm install
                npm run build
                """.stripIndent()
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh """
                cd client
                npm run deploy
                """.stripIndent()
            }
        }
        stage('Deploy Backend') {
            steps {
                sh """
                export BUILD_ID=dontKillMe
                export JENKINS_NODE_COOKIE=dontKillMe
                sudo su
                cd /var/lib/jenkins/workspace/ip6_mission_erde_wetter_pipe/server/app
                export FLASK_APP=api.py
                export FLASK_RUN_PORT=5001
                export BUILD_ID=dontKillMe
                export JENKINS_NODE_COOKIE=dontKillMe
                """.stripIndent()
            }
        }
    }
}
