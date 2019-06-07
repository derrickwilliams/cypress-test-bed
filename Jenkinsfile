pipeline {
  agent {
    dockerfile {
      filename 'e2e'
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