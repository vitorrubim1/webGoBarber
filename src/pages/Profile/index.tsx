import React, { useCallback, useRef, ChangeEvent } from "react";
import * as Yup from "yup";
import { Form } from "@unform/web";
import { Link, useHistory } from "react-router-dom";
import { FormHandles } from "@unform/core";
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from "react-icons/fi";

import getValidationErrors from "../../utils/getValidationsErrors";

import DefaultAvatar from "../../assets/default-avatar.jpg";

import { useToast } from "../../hooks/toast";
import { useAuth } from "../../hooks/auth";

import { api } from "../../services/api";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AvatarInput } from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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

  const handleAvatarChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        try {
          const data = new FormData();
          data.append("avatar", event.target.files[0]);

          const { data: updatedUser } = await api.patch("/users/avatar", data);

          updateUser(updatedUser);

          addToast({
            type: "success",
            title: "Avatar atualizado com sucesso!",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          addToast({
            type: "error",
            title: error.response?.data.message || "Erro ao atualizar avatar",
            description:
              "Ocorreu um erro ao tentar atualizar o seu avatar, tente novamente.",
          });
        }
      }
    },
    [addToast, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img
              src={user.avatar_url || DefaultAvatar}
              alt={`Foto do ${user.name}`}
            />

            <label htmlFor="avatar">
              <FiCamera />

              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                accept="image/jpg image/jpeg image/png"
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

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

          <div style={{ margin: "24px" }} />

          <Input
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
            onChange={() => formRef.current?.setFieldError("password", "")}
          />

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
            placeholder="Confirmar senha"
            onChange={() => formRef.current?.setFieldError("password", "")}
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
