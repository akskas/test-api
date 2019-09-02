* ### POST /users
    * **Request**:

            headers: {
              'content-type': 'application/json;charset=utf-8'
            }
            body: {
              users: [
                {
                  username: "tomhank001",   # required
                  password: "my_secret_001",  # required
                  firstName: "Tom",         # required
                  lastName: "Hanks",        # required
                  mobile: 9091929394,       # required
                  isActive: true            # required
                }
              ]
            }

    * **Response**:

            SUCCESS:
            {
              message: "Users save succefully"
            }

            FAILURE:
            {
              errors: [
                "One or the more users have invalid "username". "username" should be a string of    length between 5 to 20 inclusive",
                "One or the more users have invalid "isActive". "isActive" should be a boolean"
              ]
            }


* ### POST /login
    Authorization header should have base64 encoded Basic auth credentials(`base64(<username>:<password>)`)

    * **Request**:

            headers: {
              'content-type': 'application/json;charset=utf-8',
              authorization: 'Basic dG9taGFuazAwMTpteV9zZWNyZXRfMDAx'
            }

    * **Response**:

            SUCCESS:
            {
              username: "tomhank001",
              firstName: "Tom",
              lastName: "Hanks",
              mobile: 9091929394
            }

            ERROR:
            {
              errors: [ "Invalid credentials" ]
            }
