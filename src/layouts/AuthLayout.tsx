import { Outlet } from '@tanstack/react-router';
import Typography from '../components/Typography';

const AuthLayout = () => {
  return <div className="min-h-screen flex flex-col md:flex-row">
    {/* Content Side */}
    <div className="w-full md:w-3/5 lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-16 bg-white">
      <div className="w-full max-w-md lg:max-w-lg">

        <Outlet />
      </div>
    </div>
    {/* Visual Side */}
    <div className="hidden md:flex w-2/5 lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
        <Typography component="h2" className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Manage all your subscriptions in one place
        </Typography>
        <Typography className="text-xl text-center max-w-md opacity-80">
          Track, manage, and optimize your recurring payments all in one
          dashboard.
        </Typography>
        <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Typography component="h3" className="font-semibold text-xl mb-1">Easy Tracking</Typography>
            <Typography className="text-white/80 text-sm">
              Monitor all your subscriptions in one place
            </Typography>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Typography component="h3" className="font-semibold text-xl mb-1">Save Money</Typography>
            <Typography className="text-white/80 text-sm">
              Identify unused services and reduce expenses
            </Typography>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Typography component="h3" className="font-semibold text-xl mb-1">Reminders</Typography>
            <Typography className="text-white/80 text-sm">
              Never miss a payment deadline again
            </Typography>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Typography component="h3" className="font-semibold text-xl mb-1">Insights</Typography>
            <Typography className="text-white/80 text-sm">
              Visualize spending patterns and trends
            </Typography>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default AuthLayout;