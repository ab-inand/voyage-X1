import Auth from '@/components/features/Auth';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Auth defaultMode="register" />
    </div>
  );
} 