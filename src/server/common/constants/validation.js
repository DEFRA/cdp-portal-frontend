import { startsWithVowel } from '~/src/server/common/helpers/starts-with-vowel'

const validation = {
  enterValue: 'Enter value',
  chooseAnEntry: 'Choose an entry',
  chooseUser: 'Choose a user',
  notAllowed: 'Not allowed',
  choose: (choice) =>
    `Choose ${startsWithVowel(choice) ? 'an' : 'a'} ${choice}`,
  minCharacters: (value) => `${value} characters or more`,
  maxCharacters: (value) => `${value} characters or less`
}

export { validation }
