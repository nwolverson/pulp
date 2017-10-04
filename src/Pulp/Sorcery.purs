
module Pulp.Sorcery (sorcery) where

import Prelude

import Control.Monad.Aff (makeAff)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Eff.Uncurried (EffFn3, runEffFn3)
import Pulp.System.FFI (EffN, PulpEffects, AffN)

foreign import sorceryImpl :: EffFn3 PulpEffects String (EffN Unit) (EffN Unit) Unit

-- | Run sorcery given JS file
sorcery ::  String -> AffN Unit
sorcery file = makeAff \err succ -> runEffFn3 sorceryImpl file (succ unit) (err $ error "Sorcery error")