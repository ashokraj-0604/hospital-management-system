'use client';

import styles from './page.module.scss';
import { useLogin } from './useLogin';

export default function LoginPage() {
  const { values, handleSubmit, setFieldValue, isLoading, errorMessage } = useLogin();

  return (
    <section className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Sign in</h1>
        <input type="email" placeholder="Email" value={values.email} onChange={(event) => setFieldValue('email', event.target.value)} required />
        <input type="password" placeholder="Password" value={values.password} onChange={(event) => setFieldValue('password', event.target.value)} required />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Login'}</button>
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
      </form>
    </section>
  );
}
