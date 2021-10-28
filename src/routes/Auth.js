import React from 'react';
import { authService } from 'mfBase';
import AuthForm from 'components/AuthForm';

const Auth = () => {

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
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name='google'>Continue with Google</button>
        <button onClick={onSocialClick} name='github'>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;

