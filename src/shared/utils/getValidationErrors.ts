import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}

// Função que agrupa todos as mensagens de erro em um objeto
export default function getValidationErrors(err: ValidationError): Erros {
  const validationErros: Erros = {};

  err.inner.forEach(error => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
