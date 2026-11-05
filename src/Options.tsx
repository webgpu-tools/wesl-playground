import { type Accessor, For, type Setter, Show } from 'solid-js'
import type { Options, Files } from './state'
import type { SetStoreFunction } from 'solid-js/store'

type Feature = 'enable' | 'disable' | 'keep' | 'error'

function strFeatures(features: Record<string, Feature>): string {
  return Object.entries(features)
    .map(([name, enabled]) => `${name}=${enabled.toLowerCase()}`)
    .join(', ')
}
function parseFeatures(str: string): Record<string, Feature> {
  return Object.fromEntries(
    str
      .split(',')
      .map((f) => f.split('=', 2).map((x) => x.trim()))
      .filter((f) => f[0] !== '')
      .map((f) => {
        const [key, val] = f
        if (val === undefined) {
          if (key.startsWith('!')) return [key.substring(1), 'disable']
          else return [key, 'enable']
        }
        if (['disable', 'false', '0'].includes(val)) return [key, 'disable']
        else if (['enable', 'true', '1'].includes(val)) return [key, 'enable']
        else if (val === 'keep') return [key, 'keep']
        else return [key, 'error']
      }),
  )
}

function strEntrypoints(entrypoints: string[] | undefined): string {
  return (entrypoints ?? []).join(', ')
}
function parseEntrypoints(str: string): string[] | undefined {
  const res = str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
  if (res.length) {
    return res
  }
}

export type OptionsProps = {
  files: Files
  options: Options
  setOptions: SetStoreFunction<Options>
  linker: Accessor<string>
  setLinker: Setter<string>
  autorun: Accessor<boolean>
  setAutorun: Setter<boolean>
}

export const WeslJsFeatures = (props: OptionsProps) => {
  if (
    !['escape', 'minimal', 'lengthprefix', 'none'].includes(
      props.options.mangler,
    )
  ) {
    props.setOptions('mangler', 'escape')
  }

  return (
    <>
      {/*
      <span>Features</span>
      <label>
        <input
          type="checkbox"
          checked={props.options.binding_structs}
          onchange={(e) =>
            props.setOptions('binding_structs', e.currentTarget.checked)
          }
        />
        <span>binding structs</span>
      </label>
      */}
      <span>Configuration</span>
      <label>
        <span>root file</span>
        <select
          value={props.options.main}
          onchange={(e) => props.setOptions('main', e.currentTarget.value)}
        >
          <For each={props.files}>
            {(file) => <option value={file.name}>{file.name}</option>}
          </For>
        </select>
      </label>
      <label>
        <span>mangler</span>
        <select
          value={props.options.mangler}
          onchange={(e) => props.setOptions('mangler', e.currentTarget.value)}
        >
          <option value="escape">Escape underscores</option>
          <option value="minimal">Minimal</option>
          <option value="lengthprefix">Length prefix</option>
          <option value="none">None</option>
        </select>
      </label>
      <label classList={{ disabled: !props.options.condcomp }}>
        <span>cond. comp. features</span>
        <input
          type="text"
          value={strFeatures(props.options.features)}
          onchange={(e) => {
            props.setOptions(({ features, ...opts }) => ({
              ...opts,
              features: parseFeatures(e.currentTarget.value),
            }))
          }}
        />
      </label>
    </>
  )
}

export const WeslRsFeatures = (props: OptionsProps) => {
  if (!['escape', 'hash', 'unicode', 'none'].includes(props.options.mangler)) {
    props.setOptions('mangler', 'escape')
  }

  const versions = ['latest', '0.6.0', 'overloads']
  if (!versions.includes(props.options.version)) {
    props.setOptions('version', versions[0])
  }

  return (
    <>
      <label>
        <span>version</span>
        <select
          value={props.options.version}
          onchange={(e) => props.setOptions('version', e.currentTarget.value)}
        >
          <For each={versions}>
            {(ver) => <option value={ver}>{ver}</option>}
          </For>
        </select>
      </label>
      <span>Features</span>
      <label>
        <input
          type="checkbox"
          checked={props.options.imports}
          onchange={(e) => props.setOptions('imports', e.currentTarget.checked)}
        />
        <span>imports</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.condcomp}
          onchange={(e) =>
            props.setOptions('condcomp', e.currentTarget.checked)
          }
        />
        <span>conditional translation</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.generics}
          onchange={(e) =>
            props.setOptions('generics', e.currentTarget.checked)
          }
        />
        <span>generics</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.strip}
          onchange={(e) => props.setOptions('strip', e.currentTarget.checked)}
        />
        <span>strip dead code</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.lower}
          onchange={(e) => props.setOptions('lower', e.currentTarget.checked)}
        />
        <span>polyfills</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.validate}
          onchange={(e) =>
            props.setOptions('validate', e.currentTarget.checked)
          }
        />
        <span>validation</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.naga}
          onchange={(e) => props.setOptions('naga', e.currentTarget.checked)}
        />
        <span>naga validation</span>
      </label>
      <span>Configuration</span>
      <label>
        <span>root file</span>
        <select
          value={props.options.main}
          onchange={(e) => props.setOptions('main', e.currentTarget.value)}
        >
          <For each={props.files}>
            {(file) => <option value={file.name}>{file.name}</option>}
          </For>
        </select>
      </label>
      <label>
        <span>mangler</span>
        <select
          value={props.options.mangler}
          onchange={(e) => props.setOptions('mangler', e.currentTarget.value)}
        >
          <option value="escape">Escape underscores</option>
          <option value="hash">Hash suffix</option>
          <option value="unicode">Unicode confusables</option>
          <option value="none">None</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.options.mangle_main}
          onchange={(e) =>
            props.setOptions('mangle_main', e.currentTarget.checked)
          }
        />
        <span>mangle root declarations</span>
      </label>
      <label classList={{ disabled: !props.options.condcomp }}>
        <span>cond. comp. features</span>
        <input
          type="text"
          disabled={!props.options.condcomp}
          value={strFeatures(props.options.features)}
          onchange={(e) => {
            props.setOptions(({ features, ...opts }) => ({
              ...opts,
              features: parseFeatures(e.currentTarget.value),
            }))
          }}
        />
      </label>
      <label>
        <span>feature fallback</span>
        <select
          value={props.options.features_default}
          onchange={(e) =>
            props.setOptions(
              'features_default',
              e.currentTarget.value as Feature,
            )
          }
        >
          <option value="enable">Enable</option>
          <option value="disable">Disable</option>
          <option value="keep">Keep</option>
          <option value="error">Error</option>
        </select>
      </label>
      <label
        classList={{
          disabled: !props.options.strip || props.options.keep_main,
        }}
      >
        <span>strip: keep declarations</span>
        <input
          type="text"
          disabled={!props.options.strip || props.options.keep_main}
          value={strEntrypoints(props.options.keep)}
          onchange={(e) =>
            props.setOptions('keep', () =>
              parseEntrypoints(e.currentTarget.value),
            )
          }
        />
      </label>
      <label classList={{ disabled: !props.options.strip }}>
        <input
          type="checkbox"
          disabled={!props.options.strip}
          checked={props.options.keep_main}
          onchange={(e) =>
            props.setOptions('keep_main', e.currentTarget.checked)
          }
        />
        <span>strip: keep root declarations</span>
      </label>
    </>
  )
}

export const OptionsForm = (props: OptionsProps) => (
  <div id="options">
    <label>
      <input
        type="checkbox"
        name="auto-recompile"
        checked={props.autorun()}
        onChange={(e) => props.setAutorun(e.currentTarget.checked)}
      />
      <span>auto recompile</span>
    </label>
    <label>
      <span>compiler</span>
      <select
        value={props.linker()}
        onchange={(e) => props.setLinker(e.currentTarget.value)}
      >
        <For each={['wesl-rs', 'wesl-js']}>
          {(linker) => <option value={linker}>{linker}</option>}
        </For>
      </select>
    </label>
    <Show when={props.linker() === 'wesl-rs'}>
      <WeslRsFeatures {...props} />
    </Show>
    <Show when={props.linker() === 'wesl-js'}>
      <WeslJsFeatures {...props} />
    </Show>
  </div>
)
