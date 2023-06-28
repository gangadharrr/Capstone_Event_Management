import React, { Component } from 'react';
import { LoadingAnimation } from './LoadingAnimation/LoadingAnimation';
import { CardDisplay } from './CardDisplay/CardDisplay';


export function Home() {
  return (
    <div><h1>Hello, world!</h1>
      <h4>Clubs</h4>
      <hr />
      <div class="rowDisplay">
        <div class="col-sm-3  ">
          <CardDisplay imgsrc="https://community.mozilla.org/wp-content/uploads/2020/08/Mozilla-community-logo-01-01.jpg" title="Morzilla Club" description="Some quick example text to build on the card title and make up the bulk of the card's content."/>
        </div>
        <div class="col-sm-3  ">
          <CardDisplay imgsrc="https://community.mozilla.org/wp-content/uploads/2020/08/Mozilla-community-logo-01-01.jpg" title="Card title" description="Some quick example text to build on the card title and make up the bulk of the card's content."/>
        </div>
        <div class="col-sm-3 ">
          <CardDisplay imgsrc="https://community.mozilla.org/wp-content/uploads/2020/08/Mozilla-community-logo-01-01.jpg" title="Card title" description="Some quick example text to build on the card title and make up the bulk of the card's content."/>
        </div>
        <div class="col-sm-3 ">
          <CardDisplay imgsrc="https://community.mozilla.org/wp-content/uploads/2020/08/Mozilla-community-logo-01-01.jpg" title="Card title" description="Some quick example text to build on the card title and make up the bulk of the card's content."/>
        </div>
        <div class="col-sm-3 ">
          <CardDisplay imgsrc="https://community.mozilla.org/wp-content/uploads/2020/08/Mozilla-community-logo-01-01.jpg" title="Card title" description="Some quick example text to build on the card title and make up the bulk of the card's content."/>
        </div>
      </div>
    </div>

  )
}
