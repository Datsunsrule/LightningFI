interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export const Logo = ({ size = 'md' }: LogoProps) => {
  return (
    <span className={`${sizeMap[size]} tracking-tight`}>
      <span className="font-light text-amber-400">Lightning</span>
      <span className="font-bold text-amber-400">FI</span>
    </span>
  );
};
