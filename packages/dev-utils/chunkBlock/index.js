module.exports = class Block {

  constructor() {
    this.importStr = '';
    this.codeStr = '';
    this.postCodeStr = '';
    this.preCodeStr = '';
  }

  import(str, nl = true) {
    this.importStr += str + (nl ? '\n' : '')
  }

  code(str, nl = true) {
    this.codeStr += str + (nl ? '\n' : '')
  }

  postCode(str, nl = true) {
    this.postCodeStr += str + (nl ? '\n' : '')
  }
  
  preCode(str, nl = true) {
    this.preCodeStr += str + (nl ? '\n' : '')
  }

  genCode() {
    return this.importStr + this.preCodeStr + this.codeStr + this.postCodeStr
  }

}