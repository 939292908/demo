let m = require('mithril')




module.exports = {
    oncreate: function () {
        
    },
    view: function () {
        return m('div', [
            m('div.columns', {}, [
                m('div.column.is-full', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-full'
                    ]),
                ]), 
            ]),
            m('div.columns', {}, [
                m('div.column.is-full', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-full'
                    ]),
                ]), 
            ]),
            m('br'),
            m('button.button', {
                onclick: function () {
                    window.$message({content: "这是一条消息！", type: "success"})
                }
            }, [
                'message'
            ])
            /**
             * <div class="columns">
  <div class="column is-four-fifths">is-four-fifths</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-three-quarters">is-three-quarters</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-two-thirds">is-two-thirds</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-three-fifths">is-three-fifths</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-half">is-half</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-two-fifths">is-two-fifths</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-one-third">is-one-third</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-one-quarter">is-one-quarter</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>

<div class="columns">
  <div class="column is-one-fifth">is-one-fifth</div>
  <div class="column">Auto</div>
  <div class="column">Auto</div>
</div>
             */
        ])
    }
}