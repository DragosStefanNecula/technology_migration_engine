# Requirement Analysis 

Unless otherwise specified, the term “users” refers to the developer questionnaire that was administered.

## Requirement 1

The application must allow for the manually adjusting or refining of migrated cope (For example, similar to how it's done in the diffchecker inside TortoiseSVN).

### Justification

Users have declared this feature is important, with 50% of user rating a 4 out of 5, and 50% rating it a 5.

## Requirement 2
<!--[[req1spec| ]]  Implemented in [[#req1impl|main.js]]  -->
<!--[[req2| ]]  -->

The application must operate within a standalone window, but be very easy to open and keep open.

### Justification

2 thirds of users have expressed desire to have the tool integrated into their existing development environment. However, requirement 1 is impossible to implement within the VSCode extension environment because of limitations with the API provided. Therefore, due to the fact that users report requirement 1 is more important than requirement 2, the compromise is to instead have the application as a standalone application that is easy to use.

## Requirement 3 

The application must handle at minimum entire functions.

### Justification:

50% of users would be okay with basic logic, however 50% would only consider using the software if it handled entire functions.

## Requirement 4 

The application must have a good balance between automation and human oversight.

### Justification

50% of users reported that the balance on the "Automation (1) - Human oversight (5)" scale should be 3 out of 5, with the rest of users choosing either 2 or 4.

## Requirement 5

The application must not be overly reliant on large language models.

### Justification

Three fourths of users have voted 2 out of 5 on the "Minimise LLM Usage (1) - Maximise LLM Usage (5)" scale

## Requirement 6

There should be an option for the software to use a local LLM, and the data to not be sent to servers for processing

### Justification

Users have reported this as a security concern

## Requirement 7

The software must be tested and well-maintained.

### Justification

Users have reported this as a factor that would make them trust the software.

## Requirement 8

The software must be cost & time efficient

### Justification

Users have reported this as an important aspect for migration success.




