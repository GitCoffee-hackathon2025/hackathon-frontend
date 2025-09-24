import { SecurityClient } from '../security/cryptoEngine/SecurityClient'

export const RecoverRequisitions = {
  async sendRecoveryCode(email: string) {
    try {
      const securityClient = new SecurityClient()
      await securityClient.init()
      console.log('email recebido', email)

      const requestData = {
        data: { email },
        browser: navigator.userAgent, // 👈 mantenha consistente
      }

      console.log('Dados sendo enviados para encode:', requestData)

      const encoded = await securityClient.encode(requestData)

      const response = await fetch('http://localhost:3000/auth/send-recovery-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encoded),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) throw new Error(data.message || 'Erro ao enviar código')
      return data
    } catch (error) {
      console.error('Error in sendRecoveryCode:', error)
      throw error
    }
  },

  async verifyRecoveryCode(email: string, code: string) {
    const securityClient = new SecurityClient()
    await securityClient.init()
    const encoded = await securityClient.encode({
      data: { email, code }, // 👈 Dentro de data
      browser: navigator.userAgent,
    })

    const response = await fetch('http://localhost:3000/auth/verify-recovery-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encoded),
    })

    const responseBody = await response.json()
    const decoded = await securityClient.decode(responseBody)

    if (!response.ok) throw new Error(decoded.message || 'Erro ao verificar código')
    return decoded
  },

 async resetPassword(email: string, newPassword: string, code: string) {
  const securityClient = new SecurityClient()
  try {
    await securityClient.init()
    
    const encoded = await securityClient.encode({
      data: { email, newPassword, code },
      browser: navigator.userAgent,
    })

    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encoded),
    })

    const responseText = await response.text()
    console.log('✅ Resposta BRUTA do servidor:', responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('✅ Resposta PARSED:', JSON.stringify(responseData, null, 2))
    } catch (parseError) {
      console.error('❌ Erro no parse JSON:', parseError)
      throw new Error('Resposta não é JSON válido')
    }

    // Verifique a estrutura que o SecurityClient espera
    console.log('✅ Estrutura da resposta:')
    console.log('- Tipo:', typeof responseData)
    console.log('- Keys:', Object.keys(responseData))
    
    // Verifique se tem os campos obrigatórios
    const requiredFields = ['data', 'iv', 'authTag'] // ajuste conforme seu CryptoClient
    requiredFields.forEach(field => {
      console.log(`- ${field}:`, responseData[field] ? '✅ Presente' : '❌ Ausente')
    })

    const decoded = await securityClient.decode(responseData)
    console.log('✅ Decoded data:', decoded)
    if (!response.ok) throw new Error(decoded.message || 'Erro ao resetar senha')
    return decoded

  } catch (error) {
    console.error('❌ Erro detalhado:', error)
    throw error
  }
}
}
