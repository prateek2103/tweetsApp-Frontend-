import React, { useState } from "react";
import { toast } from "react-toastify";
import TweetsByUsername from "../components/TweetsByUsername";
import { changePassword, postTweet } from "../context/tweetsAction";
function Homepage() {
  const [tweet, setTweet] = useState("");
  const [showForgetForm, setShowForgetForm] = useState(false);
  const [pass, setPass] = useState({
    password: "",
    confirmPassword: "",
  });

  //method to validate tweet
  const validateTweet = (tweet) => {
    let isValid = true;
    let errorMessage = "";
    if (tweet.length > 144) {
      isValid = false;
      errorMessage = "tweet length cannot be more than 144 characters";
    } else if (tweet.length == 0) {
      isValid = false;
      errorMessage = "tweet cannot be empty";
    }

    return { isValid, errorMessage };
  };

  //forgot password handler
  const onForgetSubmitHandler = () => {
    if (pass.password === pass.confirmPassword) {
      changePassword(pass.password)
        .then((res) => {
          toast.success("password changed successfully.");
          toast.success("login with your new password next time");
        })
        .catch((err) => {
          toast.error("Please try again later");
        });

      setPass({ ...pass, password: "", confirmPassword: "" });
      setShowForgetForm(false);
    } else {
      toast.error("password and confirm password do not match");
    }
  };

  //new tweet post handler
  const onSubmitHandler = () => {
    let { isValid, errorMessage } = validateTweet(tweet);

    if (isValid) {
      let reqBody = {
        tweetMessage: tweet,
      };

      //http request
      postTweet(reqBody)
        .then((res) => {
          toast.success("tweet posted successfully");
        })
        .catch((err) => {
          toast.error("Server error. Please try again later");
        })
        .finally(() => {
          setTweet("");
        });
    } else {
      toast.error(errorMessage);
    }
  };

  //state handlers
  const onChangeHandler = (e) => {
    setTweet(e.target.value);
  };

  const onPassChangeHandler = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="grid grid-cols-12 min-w-screen">
        <div className="col-span-4 mt-[10%] px-5 text-center">
          <div class="avatar online placeholder">
            <div class="bg-ghost-focus text-black-content border-2 border-black rounded-full w-[250px]">
              <img src={localStorage.getItem("avatarUrl")}></img>
            </div>
          </div>
          {!showForgetForm && (
            <div className="text-center mt-[10%]">
              <button
                className="btn btn-primary block mx-auto mb-2 bg-tweeter-blue"
                onClick={() => {
                  setShowForgetForm(true);
                }}
              >
                Forgot Password?
              </button>
              <span className="text-md">Don't worry. We got you!</span>
            </div>
          )}

          {showForgetForm && (
            <div className="forgetPassForm mt-[5%]">
              <input
                className="input border-2 border-gray-100 w-full mx-10 mb-5"
                type="password"
                name="password"
                value={pass.password}
                placeholder="new password"
                onChange={onPassChangeHandler}
              ></input>
              <input
                className="input border-2 border-gray-100 w-full mx-10 mb-5"
                type="password"
                name="confirmPassword"
                value={pass.confirmPassword}
                placeholder="confirm password"
                onChange={onPassChangeHandler}
              ></input>

              <button
                className="btn btn-primary bg-tweeter-blue mr-5"
                onClick={onForgetSubmitHandler}
              >
                Change password
              </button>

              <button
                className="btn btn-error"
                onClick={() => {
                  setShowForgetForm(false);
                }}
              >
                cancel
              </button>
            </div>
          )}
        </div>

        <div className="col-span-8 px-[100px] ">
          <div className="mt-[10%]">
            <textarea
              onChange={onChangeHandler}
              class="textarea w-full resize-none border-2 border-gray-300"
              value={tweet}
              placeholder="What's on your mind"
              maxLength="144"
            ></textarea>

            <button
              className="btn btn-primary float-right bg-tweeter-blue"
              onClick={onSubmitHandler}
            >
              Tweet
            </button>
          </div>

          <div className="mt-[100px]">
            <h1 className="font-thin text-5xl">My tweets and replies</h1>
            <TweetsByUsername
              username={localStorage.getItem("username")}
            ></TweetsByUsername>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
