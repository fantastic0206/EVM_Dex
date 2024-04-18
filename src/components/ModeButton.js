import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import useAppContext from 'context/AppContext';

const ModeButton = () => {
  const { isDark, setDark } = useAppContext();

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setDark(true);
      document.body.className = "dark";
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('color-theme', 'dark');
    } else {
      setDark(false);
      document.body.className = "light";
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('color-theme', 'light');
    }
  }, [])

  const handleMode = () => {
    if (isDark) {
      setDark(false);
      localStorage.theme = 'light';
      document.body.className = "light";
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('color-theme', 'light');
    } else {
      setDark(true);
      document.body.className = "dark";
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('color-theme', 'dark');
    }
  }
  return (
    <button className="text-auxi-color border border-auxi-color bg-zinc-50 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex justify-center items-center" onClick={handleMode}>
      {isDark ?
        <Icon icon="tdesign:mode-dark" className="w-6 h-6" />
        :
        <Icon icon="ph:sun-light" className="w-6 h-6" />
      }
    </button>
  )
}

export default ModeButton;