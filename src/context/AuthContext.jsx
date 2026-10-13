// src/context/AuthContext.jsx — sessão e usuários
import { createContext, useCallback, useMemo, useState } from 'react';
import { USUARIOS } from '@/data/mockData';

export const AuthContext = createContext(null);

const normalizarEmail = (email) => email.trim().toLowerCase();
// Nunca expor a senha no usuário da sessão.
const semSenha = ({ senha, ...resto }) => resto;

export function AuthProvider({ children }) {
  // Usuários em estado (antes: USUARIOS.push() mutava o módulo e não re-renderizava).
  const [usuarios, setUsuarios] = useState(USUARIOS);
  const [usuario, setUsuario] = useState(null);

  const login = useCallback(
    (email, senha) => {
      const encontrado = usuarios.find(
        (u) => u.email === normalizarEmail(email) && u.senha === senha,
      );
      if (!encontrado) return { ok: false, erro: 'E-mail ou senha incorretos.' };
      setUsuario(semSenha(encontrado));
      return { ok: true, tipo: encontrado.tipo };
    },
    [usuarios],
  );

  const cadastrar = useCallback(
    ({ nome, email, senha, tipo }) => {
      const emailNormalizado = normalizarEmail(email);
      if (usuarios.some((u) => u.email === emailNormalizado)) {
        return { ok: false, erro: 'E-mail já cadastrado.' };
      }
      const novo = {
        id: `u${Date.now()}`,
        nome: nome.trim(),
        email: emailNormalizado,
        senha,
        tipo,
        foto: null,
        ...(tipo === 'barbeiro' ? { especialidade: 'Corte & Barba' } : {}),
      };
      setUsuarios((prev) => [...prev, novo]);
      setUsuario(semSenha(novo));
      return { ok: true, tipo, usuario: semSenha(novo) };
    },
    [usuarios],
  );

  const logout = useCallback(() => setUsuario(null), []);

  const barbeiros = useMemo(
    () => usuarios.filter((u) => u.tipo === 'barbeiro').map(semSenha),
    [usuarios],
  );

  const getUsuario = useCallback(
    (id) => {
      const u = usuarios.find((x) => x.id === id);
      return u ? semSenha(u) : undefined;
    },
    [usuarios],
  );

  const value = useMemo(
    () => ({ usuario, barbeiros, login, cadastrar, logout, getUsuario }),
    [usuario, barbeiros, login, cadastrar, logout, getUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
