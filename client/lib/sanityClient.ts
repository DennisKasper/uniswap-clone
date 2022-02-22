import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: '59h7kqqe',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skDzsjAlEZBd5IMfRYdQNRp4TWtzbYhZ2ED5YSdID1cHx6CIRhWnknp9VHiJ0Cx05lqfkJAC26RnDd9aDwfWNnLf3ehV0fnkyml4IlvEyDy2A3krd9Pf31RFuMMMVJ6q3RxN33gYkTF9uViGx20IPBYZFztHUYZbcqZ3uCzxvW7oqrIKQjoY',
  useCdn: false,
})