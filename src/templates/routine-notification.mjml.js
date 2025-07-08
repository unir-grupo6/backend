const routineReminderTemplate = ({ routine_name, user_name }) => `
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
  <mj-body>
    <mj-section padding="20px">
      <mj-column>
        <mj-text align="center" font-size="28px" font-weight="bold" color="#FFFFFF" padding-bottom="10px" letter-spacing="2px" font-family="'Montserrat', Arial, sans-serif">RUTINA<span style="color:#F05A1A;">GO</span></mj-text>
        <mj-text font-size="20px" font-weight="bold" padding-top="20px">¡Hola ${user_name}!</mj-text>
        <mj-text font-size="16px">
          Este es un recordatorio de que hoy tienes programada la rutina <b>${routine_name}</b>.
        </mj-text>
        <mj-text font-size="16px" padding-top="10px">
          ¡No pierdas la oportunidad de avanzar hacia tus objetivos! Recuerda que cada entrenamiento cuenta y te acerca más a tus metas.
        </mj-text>
        <mj-text font-size="16px" padding-top="10px">
          ¡Ánimo! ¡Tú puedes con esta rutina!
        </mj-text>
        <mj-text font-size="14px" color="#AAAAAA" padding-top="30px">
          Si ya realizaste la rutina, puedes ignorar este mensaje.
        </mj-text>
        <mj-text font-size="12px" color="#AAAAAA">
          © 2025 Rutina Go
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

module.exports = routineReminderTemplate ;
