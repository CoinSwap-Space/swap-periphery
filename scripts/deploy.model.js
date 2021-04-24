const path = require('path');
const fs = require('fs');

function DeployModel() {

  const self = this;

  this.deployerAddress = null
  this.factory = null
  this.cssToken = null
  this.masterCss = null
  this.router = null
  this.referral = null

  this.toJsonFile = function toJsonFile() {
    fs.writeFileSync( path.join('./', 'config-router.json'), JSON.stringify({
        router: self.router.address
      }
    ))
  }
}

module.exports = { DeployModel: DeployModel }
