import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../_app';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signIn('credentials', { email, password, callbackUrl: '/' });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}