

export default defineEventHandler(async (event) => {
  return clearUserSession(event);
})