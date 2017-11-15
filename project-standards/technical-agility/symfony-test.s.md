# [Standard] My Synfony Project is correctly tested

## Owner: [Nicolas Djambazian](https://github.com/nhacsam)

## Description

- Writing tests helps the technical team to :
  - Architecture its code
  - Develop faster
  - Prevent bugs
  - Document the code

## Impact

- A lack of tests will put in jeopardy the 4 points listed above.

## Checks

My Symfony app is well tested if :

  1. The api routs are tested with a functional test
  2. The services added to the container are unit tested 


### Api Test (~ XX min)

If you want to test the following controller

```php
<?php

namespace AppBundle\Controller;

class UsersController extends Controller
{
    /**
     * @ApiDoc()
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return User
     */
    public function getMeAction(Request $request)
    {
        return $this->getUser();
    }
}
```

You should create a new test class using the pattern `{YOUR_BUNDLE}/Tests/{SAME_PATH_AS_TESTED_CLASS}/{CLASS_NAME}Test.php` (here :  `AppBundle/Tests/Controller/UsersControllerTest.php`).
Then create a method called `test{ACTION_TO_TEST}` (here `testGetMeAction`)

In this action, you can make the call and check the api result.

```php
<?php

namespace AppBundle\Tests\Controller;

use AppBundle\Testing\AbstractWebTestCase;

class UsersControllerTest extends AbstractWebTestCase
{
    public function testGetMeAction()
    {

        $client = static::createAuthenticatedClient('user@patch.com');

        $requestAsserter = new RequestAsserter($this, $client);

        $result = $requestAsserter
            ->get('/users/me/nextappointmenttobook')
            ->expectStatusCode(Response::HTTP_OK)
            ->getJsonContent()
        ;

        $expected = array(
          'email'=> 'user@patch.com',
          'firstName'=> 'Patch me',
          'lastName'=> 'If you can',
          'expectedBirthDate'=> '2025-10-12 16:05:00',
          'postCode'=> 58300,
        );

        $this->assertEquals($result, $expected);
    }
}
```


If the call get data to the api. You need to add the data you expect in the fixtures in `src/AppBundle/DataFixtures/ORM/`.




