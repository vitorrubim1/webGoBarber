import React, { useCallback, useRef } from "react";
import * as Yup from "yup";
import { Form } from "@unform/web";
import { Link, useHistory } from "react-router-dom";
import { FormHandles } from "@unform/core";
import { FiArrowLeft, FiUser, FiMail, FiLock } from "react-icons/fi";

import LogoImg from "../../assets/logo.svg";

import getValidationErrors from "../../utils/getValidationsErrors";

import { api } from "../../services/api";
import { useToast } from "../../hooks/toast";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background, AnimationContainer } from "./styles";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("Email obrigatório")
            .email("Digite um email válido"),
          password: Yup.string().min(6, "Mínimo 6 dígitos "),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("users", data);
        history.push("/");

        addToast({
          type: "success",
          title: "Cadastro realizado!",
          description: "Você já pode fazer seu login no GoBarber :)",
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro no cadastro.",
          description: "Ocorreu um erro ao fazer cadastro, tente novamente.",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="Logo GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>

            <Input
              name="name"
              icon={FiUser}
              placeholder="Nome"
              onChange={() => formRef.current?.setFieldError("name", "")}
            />
            <Input
              name="email"
              icon={FiMail}
              placeholder="E-mail"
              onChange={() => formRef.current?.setFieldError("email", "")}
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              onChange={() => formRef.current?.setFieldError("password", "")}
            />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para Login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
