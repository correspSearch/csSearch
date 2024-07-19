<template>
  <b-card class="result">
    <b-row no-gutters>
      <b-col
        md="3"
        class="p-2 cs-result-item-year"
      >
        <p
          v-if="result._source.hasOwnProperty('dates') && formatDate(result._source.dates[0], 'de')"
          class="year"
          v-bind:class="(result._source.dates[0].original_date &&
            result._source.dates[0].original_date.text) ? 'mb-0' : ''"
        >
          <font-awesome-icon
            icon="sign-out-alt"
            class="mr-2 cs-result-icons"
          /> {{  dateLabel() }}
        </p>
        <p
          v-if="result._source.hasOwnProperty('dates') && formatDate(result._source.dates[0], 'de') &&
            result._source.dates[0].original_date.text &&
            showdateastext"
          class="cs-date-as-text"
        >
        <!-- Regex to style original date text-->
          ({{ result._source.dates[0].original_date.text.replace(/^[\(]|[\)]$/g, '') }}) 
        </p>
        <p v-if="sentPlace !== null && sentPlace !== ''">
          <font-awesome-icon
            v-if="result._source.hasOwnProperty('dates') && !formatDate(result._source.dates[0], 'de')"
            icon="sign-out-alt"
            class="mr-2 cs-result-icons"
          /> <span v-html="sentPlace" />
        </p>
        <p
          v-if="result._source.hasOwnProperty('dates') && formatDate(result._source.dates[1], 'de') &&
            showrdate"
          class="year"
          v-bind:class="(result._source.dates[1].original_date &&
            result._source.dates[1].original_date.text) ? 'mb-0' : ''"
        >
          <font-awesome-icon
            icon="sign-in-alt"
            class="mr-2 cs-result-icons"
          /> {{ formatDate(result._source.dates[1], 'de') }}
        </p>
        <p
          v-if="result._source.hasOwnProperty('dates') && formatDate(result._source.dates[1], 'de') &&
            result._source.dates[1].original_date.text &&
            showdateastext"
          class="cs-date-as-text"
        >
          ({{ result._source.dates[1].original_date.text.replace(/^[\(]|[\)]$/g, '') }})
        </p>
        <p v-if="receivedPlace !== null">
          <font-awesome-icon
            v-if="result._source.hasOwnProperty('dates') && !formatDate(result._source.dates[1], 'de')"
            icon="sign-in-alt"
            class="mr-2 cs-result-icons"
          /> <span v-html="receivedPlace" />
        </p>
      </b-col>
      <b-col
        md="9"
        class="p-2 pl-3"
      >
      <div class="results-metadata">
        <h3>
          <span v-html="sentName" />
          <font-awesome-icon
            icon="long-arrow-alt-right"
            class="mr-2 cs-result-icons"
          />
          <span v-html="receivedName" />
        </h3>
        <p>
          In: {{ result._source.source_text }}
          <span v-if="result._source.source_ref">
            <a
              v-bind:href="result._source.source_ref"
              target="_blank"
            >
              {{ result._source.source_ref_text }}
            </a>
          </span>
        </p>
        </div>
        <div class="snippets"> 
          <div class="full_text" v-if="this.store.url.facets.fullText!=0 && result.highlight.full_text">
            <p class="full_text-header">{{store.labels.vals['search.full_text.snippet']}}</p>
            <p class="full_text-snippet" v-for="snippet in result.highlight.full_text" v-bind:key="snippet" v-html="snippet"></p>
          </div>
          <div class="editorial_notes" v-if="this.store.url.facets.fullText!=0 && result.highlight.editorial_notes">
            <p class="editorial_notes-header">{{store.labels.vals['search.editorial_notes.snippet']}}</p>
            <p class="editorial_notes-snippet" v-for="snippet in result.highlight.editorial_notes" v-bind:key="snippet" v-html="snippet"></p>
          </div>
          <div class="abstract" v-if="this.store.url.facets.fullText!=0 && result.highlight.abstract">
            <p class="abstract-header">{{store.labels.vals['search.abstract.snippet']}}</p>
            <p class="abstract-snippet" v-for="snippet in result.highlight.abstract" v-bind:key="snippet" v-html="snippet"></p>
          </div>
        </div>
        <p>
          <a
            v-if="result._source.ref"
            v-bind:href="result._source.ref"
            class="btn cs-button"
          >
            <font-awesome-icon
              icon="arrow-circle-right"
              class="mr-2"
            /> {{ linkToLetter }}
          </a>
          <span v-if="!result._source.ref">
            {{ letterNr }}
          </span>
        </p>
        <div
          v-if="showcmifinfo"
          class="cs-results-additional-info p-2 rounded"
        >
          <div>
            <strong class="ml-1">{{ label['cc.publisher'] }}:</strong>
            <a
              v-for="(p, pKey) in result._source.cmif_publishers"
              v-bind:key="pKey"
              v-bind:href="p.ref"
              target="_blank"
            >
              {{ p.text }}{{ (result._source.cmif_publishers.length - 1 > pKey) ?
                ', ' : ' ' }}
            </a>
          </div>
          <div>
            <strong class="ml-1">{{ label['cc.licence'] }}:</strong>
            <a
              v-for="(l, lKey) in result._source.cmif_license"
              v-bind:key="lKey"
              v-bind:href="l.ref"
              target="_blank"
            > {{ l.text }}{{ (result._source.cmif_license.length - 1 > lKey) ?
              ', ' : ' ' }}</a>
          </div>
          <div>
            <strong class="ml-1">{{ label['search.cmifFile'] }}:</strong>
            <a
              v-bind:href="`https://correspsearch.net/api/v1.2/tei-xml.xql?cmiFile=${result._source.cmif_idno}`"
              target="_blank"
            > {{ result._source.cmif_idno }}</a>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>

import { mapState } from 'vuex';

export default {
  props: {
    result: {
      type: Object,
      required: true,
    },
    label: {
      type: Array,
      required: true,
    },
    weekdays: {
      type: Boolean,
      required: true,
    },
    reflinks: {
      type: Boolean,
      required: true,
    },
    showdateastext: {
      type: Boolean,
      required: true,
    },
    showrdate: {
      type: Boolean,
      required: true,
    },
    showcmifinfo: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
     ...mapState({
      store: state => state,
      lang: state => state.lang,
    }),
    // Returns the label for the letter-link, depending on the result
    linkToLetter() {
      // Could be redundant
      if (this.result._source.key === undefined) return this.label.linkToLetter;
      if (
        this.result._source.key
        && !this.result._source.ref
      ) return `${this.label.linkToLetterNr} ${this.result._source.key}`;
      return this.label.linkToLetter;
    },
    // Returns the number of a letter with a label
    letterNr() {
      if (this.result._source.key) return `${this.label.letterNr} ${this.result._source.key}`;
      return null;
    },
    // Construct the name of the sender
    sentName() {
      let names = '';
      this.result._source.names.map((name) => {
        if (name.action === 'sent') {
          if (name.ref !== undefined && name.ref.length > 0 && this.reflinks) {
            names += (names.length > 0) ? `, ${name.text}<a href="${name.ref[0]}" target="_blank" class="text-decoration-none">
              <svg width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`
                : `${name.text}<a href="${name.ref[0]}" target="_blank" class="text-decoration-none">
              <svg width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`;
          } else {
            names += (names.length > 0) ? `, ${name.text}`
                : name.text;
          }
        }
      });
      return (names.length > 0) ? names : null;
    },
    // Construct the name of the receiver
    receivedName() {
      let names = '';
      this.result._source.names.map((name) => {
        if (name.action === 'received') {
          if (name.ref !== undefined && name.ref.length > 0 && this.reflinks) {
            names += (names.length > 0) ? `, ${name.text}&#160;<a href="${name.ref[0]}" target="_blank" class="text-decoration-none">
              <svg width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`
                : `${name.text}&#160;<a href="${name.ref[0]}" target="_blank" class="text-decoration-none">
              <svg width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`;
          } else {
            names += (names.length > 0) ? `, ${name.text}`
                : name.text;
          }
        }
      });
      return (names.length > 0) ? names : null;
    },
    // List all "sent"-places
    sentPlace() {
      if (this.result._source.places !== undefined) {
        for (let i = 0; i < this.result._source.places.length; i += 1) {
          if (this.result._source.places[i].action === 'sent') {
            if (this.result._source.places[i].text !== undefined) {
              if (this.result._source.places[i].ref !== undefined
                && this.result._source.places[i].ref.length > 0 && this.reflinks) {
                return `${this.result._source.places[i].text} <a href="${this.result._source.places[i].ref[0]}" target="_blank" class="text-decoration-none">
              <svg width="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`;
              }
              return this.result._source.places[i].text;
            }
            return null;
          }
        }
        return null;
      }
      return null;
    },
    // List all "received"-places
    receivedPlace() {
      if (this.result._source.places !== undefined) {
        for (let i = 0; i < this.result._source.places.length; i += 1) {
          if (this.result._source.places[i].action === 'received') {
            if (this.result._source.places[i].text !== undefined) {
              if (this.result._source.places[i].ref !== undefined
                && this.result._source.places[i].ref.length > 0 && this.reflinks) {
                return `${this.result._source.places[i].text} <a href="${this.result._source.places[i].ref[0]}" target="_blank">
              <svg width="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg></a>`;
              }
              return this.result._source.places[i].text;
            }
            return null;
          }
        }
        return null;
      }
      return null;
    },
  },
  mounted() {
  },
  methods: {
    // Construction of the date-string, depending on it's type
    formatDate(date, lang = 'de') {
      if (date !== undefined) {
        const target = (lang === 'de') ? 'de-DE' : 'en-GB';
        let d = '';
        // if (date[i].action === 'sent') {
        //It's not needed to check for undefined here, since we already checked for it above
        if (
          date !== undefined
          && date.date_type === 'when'
        ) {
          d = this.convertDate(date.original_date.when, target);
        }
        if (
          date !== undefined
          && date.date_type === 'notBefore-notAfter'
        ) {
          d = `${this.store.labels.vals[`date.notBefore`]} ${
          this.convertDate(date.original_date.not_before, target)
          } ${this.store.labels.vals[`date.andNotAfter`]} ${
          this.convertDate(date.original_date.not_after, target)
          }`;
        }
        if (
          date !== undefined
          && date.date_type === 'notAfter'
        ) {
          d = `${this.store.labels.vals[`date.notAfter`]} ${
          this.convertDate(date.original_date.not_after, target)
          }`;
        }
        if (
          date !== undefined
          && date.date_type === 'notBefore'
        ) {
          d = `${this.store.labels.vals[`date.notBefore`]} ${
          this.convertDate(date.original_date.not_before, target)
          }`;
        }
        if (date !== undefined
          && date.date_type === 'from-to'
        ) {
          d = `${this.store.labels.vals[`from`]} ${
          this.convertDate(date.original_date.date_from, target)
          } ${this.store.labels.vals[`to`]}${
          this.convertDate(date.original_date.date_to, target)
          }` ;
        }
        if (
          date !== undefined
          && date.date_type === 'to'
        ) {
          //${this.store.labels.vals[`to`]}
          d = `${this.store.labels.vals[`date.notAfter`]} ${
          this.convertDate(date.original_date.date_to, target)
          }`;
        }
        if (
          date !== undefined
          && date.date_type === 'from'
        ) {
          // ${this.store.labels.vals[`from`]}
          d = `${this.store.labels.vals[`date.notBefore`]}${
          this.convertDate(date.original_date.date_from, target)
          }`;
        }
        // CHECK: Soll Text bevorzugt werden vor normalen Daten?
        if (date !== undefined
          && date.text !== undefined) {
              d = false;
          }
        return d;
      //  }
      }
      return null;
    },
    // Conversion of a date-Object to a string
    convertDate(date, lang) {
      // TODO Add weekdays
      if (date.match(/\d\d\d\d-\d\d-\d\d$/)) {
        const options = (this.weekdays) ? {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        } : {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString(lang, options);
      } if (date.match(/\d\d\d\d-\d\d$/)) {
        const options = {
            year: 'numeric',
            month: 'long',
        };
        return new Date(date).toLocaleDateString(lang, options);
      } return date;
    },
    dateLabel(){
      // var test = this.result._source.dates[0]
      //  var text = (this.lang === 'de')? this.formatDate(test, 'de') : this.formatDate(test, 'en')
      var text = (this.lang === 'de')? this.formatDate(this.result._source.dates[0], 'de') : this.formatDate(this.result._source.dates[0], 'en')
      return text
    }
  },
};
</script>
