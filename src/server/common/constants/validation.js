import { startsWithVowel } from '~/src/server/common/helpers/starts-with-vowel.js'

const validation = {
  enterValue: 'Enter value',
  chooseAnEntry: 'Choose an entry',
  chooseUser: 'Choose a user',
  chooseTeam: 'Choose a team',
  choose: (choice) =>
    `Choose ${startsWithVowel(choice) ? 'an' : 'a'} ${choice}`,
  minCharacters: (value) => `${value} characters or more`,
  maxCharacters: (value) => `${value} characters or less`,
  exactLetters: (value) => `${value} letters`
}

export { validation }
