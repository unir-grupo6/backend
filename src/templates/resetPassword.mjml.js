const resetPasswordTemplate = ({ name, verificationLink }) => `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" color="#FFFFFF" />
      <mj-section background-color="#1F2937" />
      <mj-button background-color="#F05A1A" color="#FFFFFF" font-weight="bold" />
    </mj-attributes>
    <mj-style>
      .link-text a {
        color: #F05A1A;
        text-decoration: none;
        word-break: break-word;
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#000000">
    <mj-section padding="20px">
      <mj-column>
        <mj-image width="120px" src="http://localhost:3000/rutina-go-logo-white.png" alt="Rutina Go Logo" />
        <mj-text font-size="20px" font-weight="bold" padding-top="20px">Hola ${name},</mj-text>
        <mj-text font-size="16px">
          Hemos recibido una solicitud para restablecer tu contraseña. Para continuar, haz clic en el botón de abajo.
        </mj-text>
        <mj-button href="${verificationLink}" font-size="16px" padding="15px 25px" border-radius="5px">
          Restablecer Contraseña
        </mj-button>
        <mj-text font-size="14px" padding-top="15px">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </mj-text>
        <mj-text font-size="14px" css-class="link-text">
          <a href="${verificationLink}">${verificationLink}</a>
        </mj-text>
        <mj-text font-size="12px" color="#AAAAAA" padding-top="30px">
          Si no solicitaste este cambio, puedes ignorar este correo.
        </mj-text>
        <mj-text font-size="12px" color="#AAAAAA">
          © 2025 Rutina Go
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

module.exports = resetPasswordTemplate;
