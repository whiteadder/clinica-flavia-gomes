const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

if (form && status) {
  const statusMessages = {
    error: "Por favor, reveja os campos assinalados antes de enviar.",
    success:
      "Mensagem validada com sucesso. O formulário fica preparado para futura integração, sem envio real nesta fase."
  };

  const fields = {
    name: {
      element: form.querySelector("#name"),
      error: form.querySelector("#name-error"),
      validate(value) {
        if (!value.trim()) {
          return "Indique o seu nome.";
        }

        if (value.trim().length < 2) {
          return "Indique um nome com pelo menos 2 caracteres.";
        }

        return "";
      }
    },
    email: {
      element: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate(value) {
        if (!value.trim()) {
          return "Indique o seu email.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) {
          return "Introduza um endereço de email válido.";
        }

        return "";
      }
    },
    phone: {
      element: form.querySelector("#phone"),
      error: form.querySelector("#phone-error"),
      validate(value) {
        if (!value.trim()) {
          return "";
        }

        const cleaned = value.replace(/[^\d]/g, "");
        const allowedPattern = /^[\d+()\s-]+$/;

        if (!allowedPattern.test(value.trim()) || cleaned.length < 9) {
          return "Se preencher o telefone, indique um número válido.";
        }

        return "";
      }
    },
    message: {
      element: form.querySelector("#message"),
      error: form.querySelector("#message-error"),
      validate(value) {
        if (!value.trim()) {
          return "Escreva uma mensagem breve.";
        }

        if (value.trim().length < 20) {
          return "A mensagem deve ter pelo menos 20 caracteres.";
        }

        return "";
      }
    },
    consent: {
      element: form.querySelector("#consent"),
      error: form.querySelector("#consent-error"),
      validate(value, element) {
        if (!element.checked) {
          return "É necessário confirmar o consentimento para enviar a mensagem.";
        }

        return value;
      }
    }
  };

  const setFieldState = (fieldName) => {
    const field = fields[fieldName];
    const value = field.element.type === "checkbox" ? "" : field.element.value;
    const message = field.validate(value, field.element);

    field.error.textContent = message;
    field.element.setAttribute("aria-invalid", String(Boolean(message)));

    return !message;
  };

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.dataset.state = isError ? "error" : "success";
  };

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    const eventName = field.element.type === "checkbox" ? "change" : "blur";

    field.element.addEventListener(eventName, () => {
      setFieldState(fieldName);
    });

    if (field.element.type !== "checkbox") {
      field.element.addEventListener("input", () => {
        if (field.error.textContent) {
          setFieldState(fieldName);
        }
      });
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("");

    let firstInvalidField = null;
    const allValid = Object.keys(fields).every((fieldName) => {
      const isValid = setFieldState(fieldName);

      if (!isValid && !firstInvalidField) {
        firstInvalidField = fields[fieldName].element;
      }

      return isValid;
    });

    if (!allValid) {
      setStatus(statusMessages.error, true);
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    setStatus(statusMessages.success, false);
    form.reset();
    Object.values(fields).forEach((field) => {
      field.error.textContent = "";
      field.element.setAttribute("aria-invalid", "false");
    });
  });
}
