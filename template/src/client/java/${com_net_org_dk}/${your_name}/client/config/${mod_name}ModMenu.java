package ${com_net_org_dk}.${your_name}.client.config;

import com.terraformersmc.modmenu.api.ConfigScreenFactory;
import com.terraformersmc.modmenu.api.ModMenuApi;

/**
 * ModMenu integration for the ${mod_name} mod.
 *
 * <p>
 * Requires ModMenu and Cloth Config to be installed.
 */
public class ${mod_name}ModMenu implements ModMenuApi {
        @Override
        public Class<?> getConfigScreenFactory() {
                return ${mod_name}ConfigScreen.class;
        }
}
