
module Pulp.Sorcery (sorcery) where

import Prelude

import Control.Monad.Aff (makeAff)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Eff.Uncurried (EffFn4, runEffFn4)
import Data.StrMap (StrMap)
import Pulp.System.FFI (EffN, PulpEffects, AffN)

foreign import sorceryImpl :: EffFn4 PulpEffects (StrMap String) String (EffN Unit) (EffN Unit) Unit

-- | Run sorcery, given map of JS filename -> sourcemap text, and JS file
sorcery :: StrMap String -> String -> AffN Unit
sorcery sourceMaps file = makeAff \err succ -> runEffFn4 sorceryImpl sourceMaps file (succ unit) (err $ error "Sorcery error")