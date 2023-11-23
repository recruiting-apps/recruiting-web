import { skills } from '@/offers/models/skills'
import { CloseIcon } from '@/shared/ui/assets/icons/AppIcons'
import SelectInput from '@/shared/ui/components/form/SelectInput'

interface SelectAbilitiesProps {
  abilities: string[]
  setAbilities: (abilities: string[]) => void
  label: string
}

const SelectAbilities: React.FC<SelectAbilitiesProps> = ({ label, abilities, setAbilities }) => {
  const skillsToSelect = skills.filter(skill => !abilities.includes(skill))

  const handleRemoveAbility = (ability: string) => (): void => {
    setAbilities(abilities.filter(a => a !== ability))
  }

  return (
    <>
      {skillsToSelect && <SelectInput<string>
        hasInitialValue={false}
        searchable
        label={label}
        name="abilities"
        objects={skillsToSelect}
        onChange={(value) => {
          setAbilities([...abilities, value])
        }}
      />}

      <div className='flex gap-1 items-center flex-wrap'>
        {
          abilities.map((ability, index) => (
            <p
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1"
            >
              {ability}

              <CloseIcon onClick={handleRemoveAbility(ability)} className='w-5 h-5 hover:text-black cursor-pointer' />
            </p>
          ))
        }
      </div>
    </>
  )
}

export default SelectAbilities
