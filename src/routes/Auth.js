import React, { useState } from 'react';
import { authService } from 'mfBase';

const Auth = () => {

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

  const onSocialClick = async e => {
    const { target: { name },
    } = e;

    let provider;
    const auth = authService.getAuth();

    if (name === 'google') {
      provider = new authService.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new authService.GithubAuthProvider();
    }

    await authService.signInWithPopup(auth, provider);
  }

  return (
    <div>
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
      <div>
        <button onClick={onSocialClick} name='google'>Continue with Google</button>
        <button onClick={onSocialClick} name='github'>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;

