
export default defineEventHandler(async (event) => {
  const { sendMail } = useNodeMailer()

  const config = useRuntimeConfig(event);
  console.log('/api/test-email: runtime config.nodemailer: ', config.nodemailer);

  const info = await sendMail({ subject: 'Nuxt + nodemailer', text: 'Hello from nuxt-nodemailer!', to: 'john@helmuth.org' })
  console.log('/api/test-email: info from sendMail(): ', info);
  return { message: "OK, message sent." }
})