import React, { useRef, useCallback } from "react";
import * as Yup from "yup";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { useHistory, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";

import LogoImg from "../../assets/logo.svg";

import getValidationErrors from "../../utils/getValidationsErrors";

import { useToast } from "../../hooks/toast";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { api } from "../../services/api";

import { Container, Content, Background, AnimationContainer } from "./styles";

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required("Senha obrigatória"),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "As senhas não são iguais"
          ),
        });

        await schema.validate(data, {
          abortEarly: false, // pra retornar todos os erros de uma vez
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace("?token=", "");

        if (!token) throw new Error();

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token,
        });

        history.push("/");
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro ao resetar senha",
          description: "Ocorreu um erro ao resetar sua senha, tente novamente.",
        });
      }
    },
    [addToast, history, location.search]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="Logo GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
              onChange={() => formRef.current?.setFieldError("password", "")}
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
              onChange={() => formRef.current?.setFieldError("password", "")}
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
