pipeline {
  agent {
    docker {
      image 'cypress/browsers:chrome67'
    }

  }
  stages {
    stage('Run') {
      steps {
        sh 'yarn e2e'
      }
    }
  }
}