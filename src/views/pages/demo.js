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
                m('div.column.is-four-fifths', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-four-fifths'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('div.columns', {}, [
                m('div.column.is-three-quarters', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-three-quarters'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('div.columns', {}, [
                m('div.column.is-two-thirds', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-two-thirds'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('div.columns', {}, [
                m('div.column.is-three-fifths', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-three-fifths'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('div.columns', {}, [
                m('div.column.is-half', {}, [
                    m('button.button.is-primary.is-fullwidth', {}, [
                        'is-half'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('div.columns', {}, [
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]), 
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
                m('div.column', {}, [
                    m('button.button.is-fullwidth', {}, [
                        'auto'
                    ]),
                ]),
            ]),
            m('br'),
            m('div.buttons', {}, [
                m('button.button.is-small', {}, [
                    'is-small'
                ]),
                m('button.button', {}, [
                    'Default'
                ]),
                m('button.button.is-normal', {}, [
                    'is-normal'
                ]),
                m('button.button.is-medium', {}, [
                    'is-medium'
                ]),
                m('button.button.is-large', {}, [
                    'is-large'
                ]),
                m('button.button', {
                    onclick: function () {
                        window.$message({content: "这是一条消息！", type: "success"})
                    }
                }, [
                    'message'
                ])
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