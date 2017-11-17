# [Standard] My Synfony Project is correctly tested

## Owner: [Nicolas Djambazian](https://github.com/nhacsam)
## Project : Materniteam

Today, this standard have been written for Materniteam and should be reworked to be generalized.

## Description

- Writing tests helps the technical team to :
  - Architecture its code
  - Develop faster
  - Prevent bugs
  - Document the code

## Impact

- A lack of tests will put in jeopardy the 2 points listed above.

## Checks

My Symfony app is well tested if :

  1. The api route are tested with a functional test
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

### Unit Test (~ XX min)

Unit tests must be use for everything which is registered as a service in `services.yml` or any other `yml` file.

Given the following service :

```php
<?php

namespace AppBundle\EventListener;

use AppBundle\Event\UserCreationFromSignUpEvent;
use SendinBlue\SendinBlueApiBundle\Wrapper\Mailin;

class SendMailOnUserCreationListener
{
    /**
     * @var Mailin
     */
    private $mailin;

    /**
     * @var int
     */
    private $sendinBlueTemplateId;

    /**
     * @param Mailin    $mailin
     * @param int       $sendinBlueTemplateId
     */
    public function __construct(Mailin $mailin, $sendinBlueTemplateId)
    {
        $this->mailin               = $mailin;
        $this->sendinBlueTemplateId = $sendinBlueTemplateId;
    }

    /**
     * @param UserCreationFromSignUpEvent $event
     */
    public function onUserSignUp(UserCreationFromSignUpEvent $event)
    {
        $user = $event->getUser();

        $data = array( "id" => $this->sendinBlueTemplateId,
            "to" => $user->getEmail(),
            "attr" => array("USER_NAME" => $user->getFirstName())
        );

        $result = $this->mailin->send_transactional_template($data);
    }
}
```

This service is an event listener. Like every other service, he could have dependency injected in his constructor and all his methods are stateless.

To test it, create a new file with the same hierarchy in the `Tests` folder and call it `{CLASS_NAME}Test.php`;

```php
<?php
namespace AppBundle\Tests\EventListener;

class SendMailOnUserCreationListenerTest extends AbstractWebTestCase
{
}
```

Then, in a `setUp` method, you need to mock all the dependancies of the service to isolate it from the application.

```php
    /**
     * @var Mailin
     */
    private $mockMailin;

    /**
     * @var SendMailOnUserCreationListener
     */
    private $listener;

    protected function setUp()
    {
        $this->mockMailin = \Phake::mock(Mailin::class);
        $this->listener = new SendMailOnUserCreationListener(
            $this->mockMailin, 42
        );
    }
```

To finish, for every public methode of the call, create a new `test{NameOfTheMethod}` method in the test class to test the most common path of it.
You can create multiple test method for a single tested method to test different case.


```php

<?php

    public function testSendWelcomeMailToUser()
    {
        $mockUser = \Phake::mock(User::class);
        \Phake::when($mockUser)->getEmail()->thenReturn("jean.bombeur@yop.mail");
        \Phake::when($mockUser)->getFirstName()->thenReturn("Jean");

        $mockSignUpEvent = \Phake::mock(UserCreationFromSignUpEvent::class);
        \Phake::when($mockSignUpEvent)->getUser()->thenReturn($mockUser);

        $this->listener->onUserSignUp($mockSignUpEvent);

        \Phake::verify($this->mockMailin)->send_transactional_template(
            \Phake::capture($mailinConfig)
        );

        $this->assertEquals($mailinConfig["id"], 42);
        $this->assertEquals($mailinConfig["to"], "jean.bombeur@yop.mail");
        $this->assertEquals($mailinConfig["attr"]["USER_NAME"], "Jean");
    }
}
```
