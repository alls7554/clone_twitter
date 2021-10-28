import React, { useState } from 'react';
import { authService } from 'mfBase';

const AuthForm = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = ({ target: { name, value } }) => {
    setForm({
      ...form,
      [name]: value
    });
  }

  const onSubmit = async e => {
    e.preventDefault();
    try {

      const auth = authService.getAuth();
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(
          auth, form.email, form.password
        )
      } else {
        await authService.signInWithEmailAndPassword(
          auth, form.email, form.password
        )
      }

    } catch (error) {
      setError(error);
    }
  }

  const toggleAccount = () => {
    setNewAccount(prev => !prev);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name='email'
          type='email'
          value={form.email}
          required
          placeholder='Email'
          onChange={onChange}
        />
        <input
          name='password'
          type='password'
          value={form.password}
          required
          placeholder='Password'
          onChange={onChange}
        />
        <input type='submit' value={newAccount? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? 'Sign in' : 'Create Account'}</span>
    </>
  );
};

export default AuthForm;