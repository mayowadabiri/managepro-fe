import LinkWithGoogle from '@/pages/LinkWithGoogle'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/link-with-google')({
  component: LinkWithGoogle,
  beforeLoad: async ({ location }) => {
    if (!location.state?.credential) {
      throw redirect({
        to: '/auth/login',
      });
    }
    return location;
  },

})

