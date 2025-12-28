export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  // Redirect the user to the home page if they are authenticated already.
  if (loggedIn.value) {
    return navigateTo('/')
  }
})
