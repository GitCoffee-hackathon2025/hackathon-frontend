class Opcao {
  icone: string;
  texto: string;
  link: string;
  refKey: string;

  constructor(icone: string, texto: string, link:string, refKey: string) {
    this.icone = icone
    this.texto = texto
    this.link = link
    this.refKey = refKey
  }
}

export default Opcao
