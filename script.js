window.addEventListener("DOMContentLoaded", () => {

  const API_URL =
  "https://amalakay.app.n8n.cloud/webhook/amalakay-chat";

  const UPLOAD_URL =
  "https://amalakay.app.n8n.cloud/webhook/amalakay-upload";

  const chatBox =
  document.getElementById("chatBox");

  const userInput =
  document.getElementById("userInput");

  const sendBtn =
  document.getElementById("sendBtn");

  const fileInput =
  document.getElementById("fileInput");

  /* ==========================
     HORA
  ========================== */

  function getTime() {

    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  }

  /* ==========================
     MENSAJES
  ========================== */

  function addMessage(
    text,
    sender
  ) {

    const message =
    document.createElement("div");

    message.className =
    `message ${sender}`;

    message.innerHTML = `
      <div>${text}</div>
      <div class="timestamp">
        ${getTime()}
      </div>
    `;

    chatBox.appendChild(
      message
    );

    chatBox.scrollTop =
    chatBox.scrollHeight;
  }

  /* ==========================
     TYPING
  ========================== */

  function showTyping() {

    const typing =
    document.createElement("div");

    typing.id = "typing";

    typing.className =
    "message bot";

    typing.innerHTML =
    "⚡ Amalakay AI está pensando...";

    chatBox.appendChild(
      typing
    );

    chatBox.scrollTop =
    chatBox.scrollHeight;
  }

  function removeTyping() {

    const typing =
    document.getElementById(
      "typing"
    );

    if (typing) {
      typing.remove();
    }
  }

  /* ==========================
     LIMPIAR CHAT
  ========================== */

  window.clearChat =
  function () {

    chatBox.innerHTML = `
      <div class="message bot">
        👋 Chat reiniciado.

        <div class="timestamp">
          ${getTime()}
        </div>
      </div>
    `;
  };

  /* ==========================
     ENVIAR MENSAJE
  ========================== */

  async function sendMessage() {

    const message =
    userInput.value.trim();

    if (!message) return;

    addMessage(
      message,
      "user"
    );

    userInput.value = "";

    showTyping();

    try {

      const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
            "application/json"
          },

          body: JSON.stringify({
            message: message
          })
        }
      );

      const data =
      await response.json();

      removeTyping();

      addMessage(

        data.response ||
        data.output ||
        "No hubo respuesta.",

        "bot"

      );

    } catch (error) {

      console.error(error);

      removeTyping();

      addMessage(
        "❌ Error conectando con Amalakay.",
        "bot"
      );
    }
  }

  /* ==========================
     ENTER
  ========================== */

  if (userInput) {

    userInput.addEventListener(
      "keydown",
      function (e) {

        if (
          e.key === "Enter"
        ) {

          e.preventDefault();

          sendMessage();
        }

      }
    );

  }

  /* ==========================
     BOTÓN ENVIAR
  ========================== */

  if (sendBtn) {

    sendBtn.addEventListener(
      "click",
      function () {
        sendMessage();
      }
    );

  }

  /* ==========================
     UPLOAD
  ========================== */

  window.uploadFile =
  function () {

    fileInput.click();

  };

  if (fileInput) {

    fileInput.addEventListener(
      "change",

      async function () {

        const file =
        this.files[0];

        if (!file) return;

        const formData =
        new FormData();

        formData.append(
          "file",
          file
        );

        addMessage(
          `📎 Archivo enviado:
          ${file.name}`,
          "user"
        );

        showTyping();

        try {

          const response =
          await fetch(
            UPLOAD_URL,
            {
              method: "POST",
              body: formData
            }
          );

          const data =
          await response.json();

          removeTyping();

          addMessage(

            data.response ||
            data.output ||
            "Archivo procesado.",

            "bot"

          );

        } catch (error) {

          console.error(error);

          removeTyping();

          addMessage(
            "❌ Error al subir archivo.",
            "bot"
          );
        }

      }
    );
  }

});
