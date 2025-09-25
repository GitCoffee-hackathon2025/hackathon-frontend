<template>
  <section class="terms">
    <h2>Termos de Uso e Serviços</h2>
    <ol>
      <li>
        <strong>Aceitação dos Termos:</strong>
        Ao acessar e utilizar este site, o usuário declara estar ciente e de acordo com os presentes
        Termos de Uso.
      </li>
      <li>
        <strong>Uso de Cookies:</strong>
        O site utiliza cookies para melhorar a experiência de navegação, lembrar preferências e
        coletar informações de uso.
        <br />
        Ao continuar utilizando o site, o usuário consente com o armazenamento de cookies no seu
        dispositivo.
      </li>
      <li>
        <strong>Responsabilidade do Usuário:</strong>
        O usuário compromete-se a utilizar os recursos do site de maneira ética, não praticando atos
        ilícitos, abusivos ou que possam prejudicar terceiros.
      </li>
      <li>
        <strong>Alterações nos Termos:</strong>
        Os presentes Termos de Uso podem ser alterados a qualquer momento, mediante atualização
        nesta página, passando a valer imediatamente após a publicação.
      </li>
      <li>
        <strong>Contato:</strong>
        Para dúvidas sobre estes termos ou sobre a política de cookies, o usuário pode entrar em
        contato através dos canais disponibilizados no site.
      </li>
    </ol>
  </section>
</template>


<style scoped lang="scss">
.terms {

  h2{
    margin-bottom: 30px;
  }
  ol{
    margin-left: 20px;
    list-style-type: decimal;
    color: var(--color-white);
    font-size: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    gap: 30px;


    li{
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      white-space: wrap;

      strong{
        color: var(--color-white);
        font-weight: 600;
        margin-right: 8px;
      }
    }
  }
}
</style>
