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
      <form onSubmit={onSubmit} className='container'>
        <input
          name='email'
          type='email'
          value={form.email}
          required
          placeholder='Email'
          onChange={onChange}
          className='authInput'
        />
        <input
          name='password'
          type='password'
          value={form.password}
          required
          placeholder='Password'
          onChange={onChange}
          className='authInput'
        />
        <input
          type='submit'
          className='authInput authSubmit'
          value={newAccount ? "Create Account" : "Log In"}
        />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span onClick={toggleAccount} className='authSwitch'>
        {newAccount ? 'Sign in' : 'Create Account'}
      </span>
    </>
  );
};

export default AuthForm;