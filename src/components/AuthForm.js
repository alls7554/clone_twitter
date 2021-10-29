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
    const auth = authService.getAuth();
    if (newAccount) {
      await authService.createUserWithEmailAndPassword(
        auth, form.email, form.password
      ).catch(error => {
        if (error.code === 'auth/weak-password')
          setError('Password should be at least 6 characters.');
        else if (error.code === 'auth/invalid-email')
          setError('Invalid Email.');
      })
    } else {
      await authService.signInWithEmailAndPassword(
        auth, form.email, form.password
      ).catch(error => {
        setError('Incorrect username or password.');
        setForm({
          email: '',
          password: ''
        })
      })
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
          autoComplete='username'
          placeholder='Email'
          onChange={onChange}
          className='authInput'
        />
        <input
          name='password'
          type='password'
          value={form.password}
          required
          autoComplete='current-password'
          placeholder='Password'
          onChange={onChange}
          className='authInput'
        />
        <input
          type='submit'
          className='authInput authSubmit'
          value={newAccount ? "Create Account" : "Sign In"}
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