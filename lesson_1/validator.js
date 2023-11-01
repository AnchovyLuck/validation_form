function Validator(options) {
  let selectorRules = {};

  function validate(inputElement, errorElement, rule) {
    let errorMessage;

    let rules = selectorRules[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.remove("was-validated");
      inputElement.classList.add("is-invalid");
      errorElement.classList.add("invalid-feedback");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.add("was-validated");
      inputElement.classList.remove("is-invalid");
      errorElement.classList.remove("invalid-feedback");
    }
  }

  let formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
    };
    //Loop through each rule, get and handle events
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        let errorElement =
          inputElement.parentElement.parentElement.querySelector(
            options.errorSelector
          );
        inputElement.onblur = function () {
          validate(inputElement, errorElement, rule);
        };

        inputElement.oninput = function () {
          errorElement.innerText = "";
          inputElement.classList.remove("is-invalid");
          errorElement.classList.remove("invalid-feedback");
        };

        inputElement.onchange = function (e) {
          validate(inputElement, errorElement, rule);
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
