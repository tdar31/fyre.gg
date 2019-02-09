import React, { Component } from "react";
import API from "../../utils/API";
import Nav from "../Nav";
import ProfileBody from "../ProfileBody";
import ProfileContainer from "../ProfileContainer";
import UserBanner from "../UserBanner";
import UserBody from "../UserBody";

class ProfilePage extends Component {
  state = {
    profile: {},
    matches: [],
    selectedButton: null,
    theme: "",
    matchData: {}
  };

  componentWillMount() {
    this.props.match.params.theme === "1"
      ? this.setState({ theme: "is-success" })
      : this.props.match.params.theme === "2"
      ? this.setState({ theme: "is-danger" })
      : this.props.match.params.theme === "3"
      ? this.setState({ theme: "is-info" })
      : this.setState({ theme: "is-dark" });
  }

  componentDidMount() {
    //Binds this for button selection
    this.setSelectedButton = this.setSelectedButton.bind(this);

    //Get Player Data
    let queryUser = {
      username: this.props.match.params.username,
      region: this.props.match.params.region
    }
    console.log("Submit button clicked-> queryUser: ", queryUser);
    API.getUser(queryUser)
      .then(res =>
        this.setState({ profile: res.data }, function onceStateUpdated() {
          this.getMatchHistory(this.state.profile.accountId);
        })
      )
      .catch(err => console.log(err));
  }

  getMatchHistory = profile => {
    console.log("GET MATCH HISTORY: ", this.state.profile);

    let userData = {
      accountId: profile,
      region: this.props.match.params.region
    }
    API.getMatchHistory(userData)
      .then(res => {
        this.setState({ matches: res.data }, function onceStateUpdated() {
          console.log("this.state.matches: ", this.state.matches.matches[0].gameId)
          this.getMatchData(this.state.matches.matches[0].gameId.toString())
        });
      })
      .catch(err => console.log(err));
  };

  getMatchData = gameId => {
    let userData2 = {
      accountId: this.state.profile.accountId,
      region: this.props.match.params.region,
      matchData: gameId
    }
    API.getMatchData(userData2)
    .then(res => {
      this.setState({ matchData: res.data }, function onceStateUpdated() {
        console.log("this.state.matchData: ", this.state.matchData);
      });
    })
    .catch(err => console.log(err));
  }

  setSelectedButton(id) {
    this.setState({ selectedButton: id }, function() {
      console.log("selectedBTN: ", this.state.selectedButton);
    });
  }

  render() {
    return (
      <div>
        <ProfileContainer className={this.state.theme}>
          <Nav />
          <ProfileBody>
            <UserBanner username={this.state.profile.name} level={this.state.profile.summonerLevel} region={this.props.match.params.region}/>
            <UserBody />
          </ProfileBody>
        </ProfileContainer>
      </div>
    );
  }
}

export default ProfilePage;
