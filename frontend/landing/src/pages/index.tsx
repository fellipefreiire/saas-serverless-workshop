import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import axios from 'axios'

const registerTenantFormValidationSchema = zod.object({
  tenantName: zod.string().min(1, 'Informe a tarefa'),
  tenantEmail: zod.string().min(1, 'Informe a tarefa'),
  tenantTier: zod.string().min(1, 'Informe a tarefa'),
  tenantPhone: zod.string().min(1, 'Informe a tarefa'),
  tenantAddress: zod.string().min(1, 'Informe a tarefa'),
})

type RegisterTenantFormData = zod.infer<typeof registerTenantFormValidationSchema>

const url = 'https://41adxlhcxb.execute-api.us-east-1.amazonaws.com/prod/'

export default function Home() {

  const registerTenantForm = useForm<RegisterTenantFormData>({
    resolver: zodResolver(registerTenantFormValidationSchema),
    defaultValues: {
      tenantName: '',
      tenantEmail: '',
      tenantTier: '',
      tenantPhone: '',
      tenantAddress: '',
    },
  })

  const { handleSubmit, reset, register } = registerTenantForm

  async function handleRegisterTenant(data: RegisterTenantFormData) {
    const res = await axios.post(`${url}registration`, JSON.stringify(data))
    console.log(res)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleRegisterTenant)}>
        <label htmlFor="">Name</label>
        <input type="text" {...register('tenantName')} />
        <label htmlFor="">Email</label>
        <input type="text" {...register('tenantEmail')} />
        <label htmlFor="">Tier</label>
        <input type="text" {...register('tenantTier')} />
        <label htmlFor="">Phone</label>
        <input type="text" {...register('tenantPhone')} />
        <label htmlFor="">Address</label>
        <input type="text" {...register('tenantAddress')} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
